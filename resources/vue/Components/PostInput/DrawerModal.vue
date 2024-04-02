<template>
    <n-modal v-model:show="showThis" display-directive="show">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="涂鸦板" closable @close="showThis = false"
            size="small" :content-style="{ padding: '0px' }">
            <template #default>
                <div id="canvas-container" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }">
                    <canvas id="drawer-canvas-background" ref="canvasBackground" :width="canvasWidth"
                        :height="canvasHeight" @touchmove.prevent>
                    </canvas>
                    <canvas id="drawer-canvas" ref="canvas" :class="{ painting: !dragMode, dragging: dragMode }"
                        :width="canvasWidth" :height="canvasHeight" @touchmove.prevent @mousedown="canvasDown"
                        @mouseup="canvasUp" @mousemove="canvasMove" @touchstart="canvasDown" @touchend="canvasUp"
                        @touchmove="canvasMove">
                    </canvas>
                </div>
                <n-grid x-gap="6" :cols="4">
                    <n-gi span="1">
                        <div>颜色</div>
                        <n-color-picker v-model:value="config.lineColor" :modes="['hex']" :show-alpha="false" />
                    </n-gi>
                    <n-gi span="1">
                        <div>画笔</div>
                        <n-flex id="canvas-brush" size="small" :align="'center'">
                            <span v-for="(pen, index) in brushs" :key="index"
                                :style="{ fontSize: pen.font_size + 'px' }" @click="setBrush(pen.lineWidth)">
                                {{ pen.innerHTML }}
                            </span>
                        </n-flex>
                    </n-gi>
                    <n-gi span="2">
                        <div>操作</div>
                        <n-flex id="canvas-control" size="small">
                            <span v-for="(control, index) in controls" :key="index" :title="control.title"
                                :class="[control.className]" v-html="control.innerHTML"
                                @click="controlCanvas(control.action)"></span>
                        </n-flex>
                    </n-gi>
                </n-grid>
            </template>
            <template #action>
                <n-flex justify="end">
                    <n-upload :default-upload="false" @change="drawerInsert" :show-file-list="false">
                        <f-button>加载图片</f-button>
                    </n-upload>
                    <f-button type="primary" @click="uploadImageHandle" :disabled="userIsLocked"
                        :loading="uploading">上传</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { uploadImagePoster, type uploadImageParams } from '@/api/methods/common';
import { useUserStore } from '@/stores/user';
import { FButton } from '@custom';
import { NCard, NColorPicker, NFlex, NGi, NGrid, NModal, NUpload, type UploadFileInfo } from 'naive-ui';
import { computed, onMounted, ref } from 'vue';
import { useCommonStore } from '@/stores/common';

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()

//组件props
interface Props {
    userIsLocked: boolean,
    forumId: number,
    threadId: number
}
const props = withDefaults(defineProps<Props>(), {
})

//来自父组件的唤醒emit
const showThis = ref<boolean>(false)
function show() {
    showThis.value = true
}
defineExpose({ show })

//各种emit
const emit = defineEmits<{
    insertImage: [ImgSrc: string],
}>()

const canvas = ref<HTMLCanvasElement>()//画板本体
const context = computed(() => canvas.value?.getContext("2d") as CanvasRenderingContext2D)//画板的context
const canvasBackground = ref<HTMLCanvasElement>()//上传的图片的画板本体
const backgroundContext = computed(() => canvasBackground.value?.getContext("2d") as CanvasRenderingContext2D)//上传的图片的画板context

const backgroundImg = new Image() //插入的图片

let canvasMoveUse = false

const backgroundImgSize = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
}

// 存储当前表面状态数组-上一步
const preDrawAry = ref<ImageData[]>([])
// 存储当前表面状态数组-下一步
const nextDrawAry = ref<ImageData[]>([])
// 中间数组
const middleAry = ref<ImageData[]>([])

// 配置参数
const config = ref({
    lineWidth: 3,
    lineColor: "#111111",
    shadowBlur: 1,
})

const eraserMode = ref<boolean>(false)
const dragMode = ref<boolean>(false)
let lastX = 0
let lastY = 0

const canvasWidth = computed(() => {
    if (window.innerWidth > 836) {
        return 796;
    } else {
        return window.innerWidth - 36;
    }
})
const canvasHeight = computed(() => {
    if (window.innerHeight > 580) {
        return 400;
    } else {
        return window.innerHeight - 212;
    }
})

//操作选项
const controls = computed(() => [
    {
        title: "上一步",
        action: "prev",
        className: preDrawAry.value.length ? "active" : "",
        innerHTML:
            '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/></svg>',
    },
    {
        title: "下一步",
        action: "next",
        className: nextDrawAry.value.length ? "active" : "",
        innerHTML:
            '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/></svg>',
    },
    {
        title: "橡皮擦",
        action: "eraser",
        className:
            preDrawAry.value.length || nextDrawAry.value.length ? "active" : "",
        innerHTML:
            '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">  <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/></svg>',
    },
    {
        title: "清除",
        action: "clear",
        className:
            preDrawAry.value.length || nextDrawAry.value.length ? "active" : "",
        innerHTML:
            '<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/></svg>',
    },
    {
        title: "拖动背景",
        action: "drag",
        className: dragMode.value ? "active" : "",
        innerHTML:
            '<svg width="20" height="20" fill="currentColor"  viewBox="0 0 16 16"> <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 1 0 1 0V6.435a4.9 4.9 0 0 1 .106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 0 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.035a.5.5 0 0 1-.416-.223l-1.433-2.15a1.5 1.5 0 0 1-.243-.666l-.345-3.105a.5.5 0 0 1 .399-.546L5 8.11V9a.5.5 0 0 0 1 0V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v5.34l-1.2.24a1.5 1.5 0 0 0-1.196 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z"/></svg>',
    },
])
//画笔选项
const brushs = [
    {
        lineWidth: 3,
        innerHTML: "🖌️",
        font_size: 12,
    },
    {
        lineWidth: 6,
        innerHTML: "🖌️",
        font_size: 16,
    },
    {
        lineWidth: 12,
        innerHTML: "🖌️",
        font_size: 20,
    },
]

//初始化画板
function initDraw() {
    const preData = new ImageData(canvasWidth.value, canvasHeight.value)
    middleAry.value.push(preData);// 空绘图表面进栈
}
onMounted(() => {
    initDraw()
})

// 设置绘画配置
function setCanvasStyle() {
    context.value.lineWidth = config.value.lineWidth;
    context.value.shadowBlur = config.value.shadowBlur;
    context.value.shadowColor = config.value.lineColor;
    context.value.strokeStyle = config.value.lineColor;
    context.value.lineCap = "round";
    context.value.lineJoin = "round";
}


function canvasMove(e: MouseEvent | TouchEvent) {
    if (canvasMoveUse) {
        if (!dragMode.value) {
            context.value.beginPath();
            context.value.moveTo(lastX, lastY);
            const t = e.target as HTMLElement;
            let canvasX;
            let canvasY;
            if (e instanceof MouseEvent) {
                canvasX = e.clientX - t.getBoundingClientRect().x;
                canvasY = e.clientY - t.getBoundingClientRect().y;
            } else {
                canvasX = e.changedTouches[0].clientX - t.getBoundingClientRect().x;
                canvasY = e.changedTouches[0].clientY - t.getBoundingClientRect().y;
            }
            context.value.globalCompositeOperation = eraserMode.value
                ? "destination-out"
                : "source-over";
            // context.value.rect(canvasX,canvasY,20,20);
            context.value.lineTo(canvasX, canvasY);
            [lastX, lastY] = [canvasX, canvasY];
            context.value.stroke();
        } else {
            //拖曳背景
            const t = e.target as HTMLElement;
            let canvasX;
            let canvasY;
            if (e instanceof MouseEvent) {
                canvasX = e.clientX - t.getBoundingClientRect().x;
                canvasY = e.clientY - t.getBoundingClientRect().y;
            } else {
                canvasX = e.changedTouches[0].clientX - t.getBoundingClientRect().x;
                canvasY = e.changedTouches[0].clientY - t.getBoundingClientRect().y;
            }
            canvasBackground.value!.height = canvasBackground.value!.height;
            let sizeTemp = {
                x: backgroundImgSize.x + (canvasX - lastX),
                y: backgroundImgSize.y + (canvasY - lastY),
                width: backgroundImgSize.width,
                height: backgroundImgSize.height,
            };
            drawBackground(backgroundImg, sizeTemp);
        }
    }
}

// mouseup
function canvasUp(e: MouseEvent | TouchEvent) {
    if (!dragMode.value) {
        const preData = context.value.getImageData(
            0,
            0,
            canvas.value!.width,
            canvas.value!.height
        );
        if (!nextDrawAry.value.length) {
            // 当前绘图表面进栈
            middleAry.value.push(preData);
        } else {
            middleAry.value = [];
            middleAry.value = middleAry.value.concat(preDrawAry.value);
            middleAry.value.push(preData);
            nextDrawAry.value = [];
        }
        canvasMoveUse = false;
    } else {
        //记录抬起鼠标位置，作为背景定位的x,y
        const t = e.target as HTMLElement;
        let canvasX;
        let canvasY;
        if (e instanceof MouseEvent) {
            canvasX = e.clientX - t.getBoundingClientRect().x;
            canvasY = e.clientY - t.getBoundingClientRect().y;
        } else {
            canvasX = e.changedTouches[0].clientX - t.getBoundingClientRect().x;
            canvasY = e.changedTouches[0].clientY - t.getBoundingClientRect().y;
        }
        backgroundImgSize.x += canvasX - lastX;
        backgroundImgSize.y += canvasY - lastY;
        canvasMoveUse = false;
    }
}

// mousedown
function canvasDown(e: MouseEvent | TouchEvent) {
    if (!dragMode.value) {
        canvasMoveUse = true;
        // client是基于整个页面的坐标
        // offset是cavas距离顶部以及左边的距离
        const t = e.target as HTMLElement;
        let canvasX;
        let canvasY;
        if (e instanceof MouseEvent) {
            canvasX = e.clientX - t.getBoundingClientRect().x;
            canvasY = e.clientY - t.getBoundingClientRect().y;
        } else {
            canvasX = e.changedTouches[0].clientX - t.getBoundingClientRect().x;
            canvasY = e.changedTouches[0].clientY - t.getBoundingClientRect().y;
        }
        setCanvasStyle();
        // 清除子路径
        lastX = canvasX;
        lastY = canvasY;
        // 当前绘图表面状态
        const preData = context.value.getImageData(
            0,
            0,
            canvas.value!.width,
            canvas.value!.height
        );
        // 当前绘图表面进栈
        preDrawAry.value.push(preData);
    } else {
        //记录点下鼠标时候的位置
        const t = e.target as HTMLElement;
        let canvasX;
        let canvasY;
        if (e instanceof MouseEvent) {
            canvasX = e.clientX - t.getBoundingClientRect().x;
            canvasY = e.clientY - t.getBoundingClientRect().y;
        } else {
            canvasX = e.changedTouches[0].clientX - t.getBoundingClientRect().x;
            canvasY = e.changedTouches[0].clientY - t.getBoundingClientRect().y;
        }
        lastX = canvasX;
        lastY = canvasY;
        canvasMoveUse = true;
    }
}
// 设置笔刷大小
function setBrush(type: number) {
    config.value.lineWidth = type;
    eraserMode.value = false;
    dragMode.value = false;
}
// 操作
function controlCanvas(action: string) {
    switch (action) {
        case "prev":
            if (preDrawAry.value.length) {
                const popData = preDrawAry.value.pop();
                const midData = middleAry.value[preDrawAry.value.length + 1];
                nextDrawAry.value.push(midData);
                context.value.putImageData(popData!, 0, 0);
            }
            break;
        case "next":
            if (nextDrawAry.value.length) {
                const popData = nextDrawAry.value.pop();
                const midData =
                    middleAry.value[
                    middleAry.value.length - nextDrawAry.value.length - 2
                    ];
                preDrawAry.value.push(midData);
                context.value.putImageData(popData!, 0, 0);
            }
            break;
        case "clear":
            context.value.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
            preDrawAry.value = [];
            nextDrawAry.value = [];
            middleAry.value = [middleAry.value[0]];
            break;
        case "eraser":
            eraserMode.value = true;
            break;
        case "drag":
            dragMode.value = true;
            break;
    }
}

//插入图片
function drawerInsert(options: { file: UploadFileInfo, fileList: Array<UploadFileInfo>, event?: Event }) {
    if (options.file.file) {
        var reader = new FileReader();
        reader.readAsDataURL(options.file.file);
        reader.onload = (event) => {
            backgroundImg.src = event.target!.result as string;
            backgroundImg.onload = function () {
                var canvas = canvasBackground;
                var image = backgroundImg;
                //根据canvas大小，缩放图片到合适尺寸
                backgroundImgSize.width = image.width;
                backgroundImgSize.height = image.height;
                if (image.width / image.height >= canvas.value!.width / canvas.value!.height) {
                    if (image.width > canvas.value!.width) {
                        backgroundImgSize.width = canvas.value!.width;
                        backgroundImgSize.height =
                            (image.height * canvas.value!.width) / image.width;
                    }
                } else {
                    if (image.height > canvas.value!.height) {
                        backgroundImgSize.width =
                            (image.width * canvas.value!.height) / image.height;
                        backgroundImgSize.height = canvas.value!.height;
                    }
                }
                drawBackground(image, backgroundImgSize);
            };
        };
    }
}

//绘制背景图（用于拖曳背景）
function drawBackground(
    image: HTMLImageElement,
    size: { x: number, y: number, width: number, height: number }
) {
    backgroundContext.value.drawImage(
        image,
        size.x,
        size.y,
        size.width,
        size.height
    );
}

//上传图片
const uploading = ref<boolean>(false)
function uploadImageHandle() {

    // 第一步，把前景写入背景（绘制到canvasBackground中）
    let image = new Image();
    image.src = canvas.value!.toDataURL("image/png");
    image.onload = () => {
        backgroundContext.value.drawImage(image, 0, 0);
        imageToBlob(canvasBackground.value!)
    }

    // 第二步，把canvasBackground转换为Blob
    function imageToBlob(canvas: HTMLCanvasElement) {
        canvas!.toBlob((blob) => {
            if (blob) uploadHandle(blob)
        }, 'image/png');
    }

    // 第三步，把调用上传接口
    function uploadHandle(blob: Blob) {
        const params: uploadImageParams = {
            binggan: userStore.binggan!,
            file: blob,
            mode: 'img',
            thread_id: props.threadId,
            forum_id: props.forumId
        }
        uploading.value = true
        uploadImagePoster(params)
            .then((response) => {
                emit('insertImage', response.file_url)//插入链接到输入框
                uploading.value = false
                showThis.value = false
            })
            .catch(() => {
                uploading.value = false
            });
    }
};

</script>


<style lang="scss">
#canvas-container {
    position: relative;
}

#drawer-canvas,
#drawer-canvas-background {
    position: absolute;
    left: 0;
    top: 0;
}

#drawer-canvas {
    border: 1px #585858 solid;

    &.painting {
        cursor: crosshair;
    }

    &.dragging {
        cursor: grab;
    }
}


#canvas-color .active {
    border: 1px solid #5fb878;
}

#canvas-brush span {
    cursor: pointer;
}

#canvas-control span {
    font-size: 14px;
    cursor: pointer;
}

#canvas-control .active,
#canvas-brush .active {
    color: #5fb878;
}
</style>