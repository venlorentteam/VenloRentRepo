import React, { useState, useEffect } from 'react'
import './StatCounter.css'

const StatCounter = ({ value, label }) => {
    // Stat Counter Local Component
    const [count, setCount] = useState(0)

    useEffect(() => {
        const target = parseInt(value.replace(/\D/g, ''))
        const duration = 1500
        const step = Math.ceil(target / (duration / 16))
        let current = 0
        const timer = setInterval(() => {
            current = Math.min(current + step, target)
            setCount(current)
            if (current >= target) clearInterval(timer)
        }, 16)
        return () => clearInterval(timer)
    }, [value])

    const suffix = value.replace(/[0-9]/g, '')
    return (
        <div className="stat-item">
            <span className="stat-value">{count.toLocaleString()}{suffix}</span>
            <span className="stat-label">{label}</span>
        </div>
    )

}
export default StatCounter
