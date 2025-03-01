import { ProgressBar, ProgressBarProps } from "react-aria-components";

interface ProgressCircleProps extends Omit<ProgressBarProps, "children"> {
    size?: number;
    strokeWidth?: number;
}

export function ProgressCircle({ size = 48, strokeWidth = 4, ...props }: ProgressCircleProps) {
    // SVG parameters
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;
    
    return (
        <div className="flex items-center justify-center">
            <ProgressBar isIndeterminate {...props}>
                {({ percentage, isIndeterminate }) => (
                    <svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        fill="none"
                        className={`transform ${isIndeterminate ? "animate-spin" : ""}`}
                        style={{ animationDuration: "1.5s" }}
                    >
                        {/* Background circle */}
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            stroke="#e2e8f0"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                        />
              
                        {/* Foreground circle */}
                        {isIndeterminate ? (
                            <circle
                                cx={center}
                                cy={center}
                                r={radius}
                                stroke="var(--color-sky-400)"
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference * 0.75}
                                strokeLinecap="round"
                                fill="transparent"
                            />
                        ) : (
                            <circle
                                cx={center}
                                cy={center}
                                r={radius}
                                stroke="var(--color-sky-400)"
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference * (1 - (percentage || 0) / 100)}
                                strokeLinecap="round"
                                fill="transparent"
                                transform={`rotate(-90 ${center} ${center})`}
                            />
                        )}
                    </svg>
                )}
            </ProgressBar>
        </div>
    );
};