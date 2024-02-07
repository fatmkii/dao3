function showDialog(title: string, onPositiveClick: (event: MouseEvent) => void = () => { }, onNegativeClick: (event: MouseEvent) => void = () => { }, mode: string = 'warning') {
    if (mode === 'warning') {
        window.$dialog.warning({
            title: title,
            closable: false,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: onPositiveClick,
            onNegativeClick: onNegativeClick,
        })
    }

}

export default showDialog