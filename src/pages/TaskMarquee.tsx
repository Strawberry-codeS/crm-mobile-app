import React, { useState, useEffect } from 'react';

// 直接接收外部传入的任务，保持和你原有逻辑一致
interface TaskMarqueeProps {
    taskText: string;
}

const TaskMarquee: React.FC<TaskMarqueeProps> = ({ taskText }) => {
    // 这里可以放多个任务轮播，也可以只显示传入的那一个
    const taskList = taskText ? [taskText] : ["询问痛点", "确认需求", "预约试听", "跟进回访"];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (taskList.length <= 1) return; // 如果只有一个任务，不轮播
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % taskList.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [taskList.length]);

    return (
        <div className="bg-orange-50 rounded-lg px-3 py-2 mb-4 inline-block w-full">
            <span className="text-xs text-orange-500 font-bold">
                <span className="text-orange-400 mr-1">当前任务:</span>
                <div className="inline-block relative h-4 overflow-hidden">
                    <div
                        className="transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
                    >
                        {taskList.map((task, idx) => (
                            <div key={idx} className="leading-4 text-xs">
                                {task}
                            </div>
                        ))}
                    </div>
                </div>
            </span>
        </div>
    );
};

export default TaskMarquee;