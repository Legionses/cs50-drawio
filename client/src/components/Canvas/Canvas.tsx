import React, { MouseEventHandler, useEffect, useRef } from 'react'
import styles from './styles.module.css'

const getMousePos = (
    canvas: HTMLCanvasElement,
    evt: React.MouseEvent<HTMLCanvasElement>
) => {
    const rect = canvas.getBoundingClientRect()
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    }
}
const Canvas = () => {
    const canvas = useRef<HTMLCanvasElement>(null)
    const isDrawing = useRef(false)

    useEffect(() => {
        if (!canvas.current) return
        canvas.current.width = canvas.current.clientWidth
        canvas.current.height = canvas.current.clientHeight
        const mouseUp = () => {
            if (isDrawing.current) isDrawing.current = false
        }

        document.addEventListener('mouseup', mouseUp)
        return () => {
            document.removeEventListener('mouseup', mouseUp)
        }
    }, [])

    const mouseDown: MouseEventHandler<HTMLCanvasElement> = (evt) => {
        if (!canvas.current) return
        isDrawing.current = true
        // @ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.current.getContext('2d')
        const currentPosition = getMousePos(canvas.current, evt)
        ctx.moveTo(currentPosition.x, currentPosition.y)
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.lineCap = 'round'
        ctx.strokeStyle = `rgba(14, 255, 255, 1)`
    }

    const mouseMove: MouseEventHandler<HTMLCanvasElement> = (evt) => {
        if (!isDrawing.current || !canvas.current) return
        const currentPosition = getMousePos(canvas.current, evt)
        // @ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.current.getContext('2d')
        ctx.lineTo(currentPosition.x, currentPosition.y)
        ctx.stroke()
        // store(currentPosition.x, currentPosition.y, currentSize, currentColor)
    }

    return (
        <canvas
            ref={canvas}
            className={styles.canvas}
            onMouseDown={mouseDown}
            onMouseMove={mouseMove}
        />
    )
}

export default Canvas
