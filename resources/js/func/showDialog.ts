interface args {
    title: string,
    content?: string,
    mode?: 'warning' | 'success'
    onPositiveClick?: (event: MouseEvent) => void,
    onNegativeClick?: (event: MouseEvent) => void,
}

function showDialog(args: args) {
    const dialogArgs = {
        title: args.title,
        closable: false,
        content: args.content,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: args.onPositiveClick,
        onNegativeClick: args.onNegativeClick,
    }

    switch (args.mode) {
        case 'warning':
            window.$dialog.warning(dialogArgs)
            break;
        case 'success':
            window.$dialog.success(dialogArgs)
            break;
        default:
            window.$dialog.warning(dialogArgs)
            break;
    }
}

export default showDialog