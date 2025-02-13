import { useState, useEffect, useMemo } from 'react'

const getOrientation = () => window.screen.orientation.type

export const useScreenOrientation = () => {
    const [orientation, setOrientation] =
        useState(getOrientation())

    const updateOrientation = () => {
        setOrientation(getOrientation())
    }

    const isVertical = useMemo(() => orientation.includes('portrait'), [orientation])

    useEffect(() => {
        window.addEventListener(
            'orientationchange',
            updateOrientation
        )
        return () => {
            window.removeEventListener(
                'orientationchange',
                updateOrientation
            )
        }
    }, [])

    return {
        orientation,
        isVertical
    }
}