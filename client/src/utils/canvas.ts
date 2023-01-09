import { Point } from '../models/Point.model'

export const drawLine = (points: Point[], canvas: HTMLCanvasElement) => {
    // @ts-ignore
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

    for (let i = 1; i < points.length; i++) {
        const { x, y, size, color } = points[i]
        ctx.beginPath()
        ctx.moveTo(points[i - 1].x, points[i - 1].y)
        ctx.lineWidth = size
        ctx.lineCap = 'round'
        ctx.strokeStyle = color
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}

export const redrawCanvas = (lines: [Point[]], canvas: HTMLCanvasElement) => {
    lines.forEach((points) => {
        for (let i = 1; i < points.length; i++) {
            drawLine(points, canvas)
        }
    })
    console.log('Canvas redraw.')
}
