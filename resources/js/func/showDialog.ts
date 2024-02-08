interface args {
    title: string,
    mode?: 'warning' | 'success'
    onPositiveClick?: (event: MouseEvent) => void,
    onNegativeClick?: (event: MouseEvent) => void,
}

function showDialog(args: args) {

    const dialogArgs = {
        title: args.title,
        closable: false,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: args.onPositiveClick,
        onNegativeClick: args.onNegativeClick,
    }

    if (args.mode === 'warning') {
        window.$dialog.warning(dialogArgs)
    }
    if (args.mode === 'success') {
        window.$dialog.success(dialogArgs)
    }
}

export default showDialog