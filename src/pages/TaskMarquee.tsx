import React, { useState, useEffect } from 'react';

// 接收外部传入的任务文字
interface TaskMarqueeProps {
  taskText: string;
}

const TaskMarquee: React.FC<TaskMarqueeProps> = ({ taskText }) => {
  // 如果你想轮播多个任务，就在这里加，比如：["询问痛点", "确认需求", "预约试听"]
  const taskList = [taskText]; // 先保留单个任务，要轮播就加多个
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3秒轮播一次（如果只有1个任务，不会动）
  useEffect(() => {
    if (taskList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % taskList.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [taskList.length]);

  return (
    <span className="text-xs text-orange-500 font-bold">
      {/* 保留你要的 text-orange-400 样式，一丝不改 */}
      <span className="text-orange-400 mr-1">当前任务:</span>

      {/* 只给后面的任务文字加滚动效果，样式和原有一致 */}
      <div className="inline-block relative h-4 overflow-hidden align-middle">
        <div
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-${currentIndex * 100}%)` }}
        >
          {taskList.map((task, idx) => (
            <div key={idx} className="leading-4 text-xs text-orange-500">
              {task}
            </div>
          ))}
        </div>
      </div>
    </span>
  );
};

export default TaskMarquee;