import React, { MouseEventHandler, useEffect, useRef } from 'react'
import styles from './styles.module.css'

interface Line {
    x: number
    y: number
    size: number
    color: string
}

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
    const lines = useRef<Line[][]>([])
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

    const startLine = (x: number, y: number, s: number, c: string) => {
        const line = {
            x: x,
            y: y,
            size: s,
            color: c,
        }
        lines.current.push([line])
    }

    const storeLine = (x: number, y: number, s: number, c: string) => {
        const line = {
            x: x,
            y: y,
            size: s,
            color: c,
        }
        lines.current[lines.current.length - 1].push(line)
    }

    const drawLine = (
        lineStart: Line,
        lineEnd: Line,
        canvas: HTMLCanvasElement
    ) => {
        // @ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
        const { x, y, size, color } = lineEnd
        ctx.beginPath()
        ctx.moveTo(lineStart.x, lineStart.y)
        ctx.lineWidth = size
        ctx.lineCap = 'round'
        ctx.strokeStyle = color
        ctx.lineTo(x, y)
        ctx.stroke()
    }

    const load = () => {
        const savedCanvas = localStorage.getItem('savedCanvas')
        // @ts-ignore
        console.log(savedCanvas, JSON.parse(savedCanvas), canvas.current)
        if (savedCanvas) {
            lines.current = JSON.parse(savedCanvas)

            lines.current.forEach((points) => {
                for (let i = 1; i < points.length; i++) {
                    if (canvas.current)
                        drawLine(points[i - 1], points[i], canvas.current)
                }
            })
            console.log('Canvas loaded.')
        } else {
            console.log('No canvas in memory!')
        }
    }

    const save = () => {
        localStorage.removeItem('savedCanvas')
        localStorage.setItem('savedCanvas', JSON.stringify(lines.current))
        console.log('Saved canvas!')
    }

    useEffect(() => {
        // @ts-ignore
        window.load = load
        // @ts-ignore
        window.save = save
    }, [])

    const mouseDown: MouseEventHandler<HTMLCanvasElement> = (evt) => {
        if (!canvas.current) return
        isDrawing.current = true
        // @ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.current.getContext('2d')
        const currentPosition = getMousePos(canvas.current, evt)
        ctx.moveTo(currentPosition.x, currentPosition.y)
        ctx.beginPath()
        ctx.lineWidth = 5
        ctx.lineCap = 'round'
        ctx.strokeStyle = `rgba(14, 255, 255, 1)`
        startLine(
            currentPosition.x,
            currentPosition.y,
            5,
            `rgba(14, 255, 255, 1)`
        )
    }

    const mouseMove: MouseEventHandler<HTMLCanvasElement> = (evt) => {
        if (!isDrawing.current || !canvas.current) return
        const currentPosition = getMousePos(canvas.current, evt)
        // @ts-ignore
        const ctx: CanvasRenderingContext2D = canvas.current.getContext('2d')
        ctx.lineTo(currentPosition.x, currentPosition.y)
        ctx.stroke()
        storeLine(
            currentPosition.x,
            currentPosition.y,
            5,
            `rgba(14, 255, 255, 1)`
        )
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
