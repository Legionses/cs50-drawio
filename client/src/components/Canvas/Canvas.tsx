import React, { MouseEventHandler, useEffect, useRef, forwardRef } from 'react'
import styles from './styles.module.css'
import { Point } from '../../models/Point.model'
import { drawLine } from '../../utils/canvas'

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
const Canvas = (
    { saveLine = (line: Point[]) => {} }: any,
    // @ts-ignore
    canvasRef
) => {
    const lines = useRef<Point[][]>([])
    const isDrawing = useRef(false)

    useEffect(() => {
        if (!canvasRef || !canvasRef.current) return
        canvasRef.current.width = canvasRef.current.clientWidth
        canvasRef.current.height = canvasRef.current.clientHeight
        const mouseUp = () => {
            if (isDrawing.current) isDrawing.current = false
            saveLine(lines.current[lines.current.length - 1])
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

    const load = () => {
        const savedCanvas = localStorage.getItem('savedCanvas')
        // @ts-ignore
        console.log(JSON.parse(savedCanvas), canvasRef.current)
        if (savedCanvas) {
            lines.current = JSON.parse(savedCanvas)

            lines.current.forEach((points) => {
                for (let i = 1; i < points.length; i++) {
                    if (canvasRef.current) drawLine(points, canvasRef.current)
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
        if (!canvasRef.current) return
        isDrawing.current = true
        // @ts-ignore
        const ctx: CanvasRenderingContext2D = canvasRef.current.getContext('2d')
        const currentPosition = getMousePos(canvasRef.current, evt)
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
        if (!isDrawing.current || !canvasRef.current) return
        const currentPosition = getMousePos(canvasRef.current, evt)
        // @ts-ignore
        const ctx: CanvasRenderingContext2D = canvasRef.current.getContext('2d')
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
            ref={canvasRef}
            className={styles.canvas}
            onMouseDown={mouseDown}
            onMouseMove={mouseMove}
        />
    )
}

export default forwardRef(Canvas)
