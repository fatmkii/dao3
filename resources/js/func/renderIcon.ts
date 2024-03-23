import { h } from 'vue'
import { NIcon } from 'naive-ui';
import type { Component } from 'vue';

interface params {
    size?: string | number,
    color?: string
}

const paramsDefault: params = {
    size: '1rem'
}

const renderIcon = (icon: Component, params: params = paramsDefault) => {
    let iconSize: string | number = '1rem'
    if (typeof params.size === 'string') {
        iconSize = params.size
    } else if (typeof params.size === 'number') {
        iconSize = params.size + 'rem'
    }

    return () => {
        return h(NIcon, { size: iconSize, color: params.color }, {
            default: () => h(icon)
        })
    }
}

export { renderIcon }