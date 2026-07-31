import React from 'react'

import AvatarGroup from '../AvatarGroup';
import { LuPaperclip } from 'react-icons/lu';
import moment from 'moment';
import Progresss from '../Progresss';


const TaskCard = ({ title, description, priority, status, progress, createdAt, dueDate, assignedTo, attachmentCount, completedTodoCount, todoChecklist, user, onClick }) => {

    const getStatusTagColor = () => {
        switch (status) {
            case "In Progress":
                return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

            case "Completed":
                return "text-lime-500 bg-lime-50 border border-cyan-200";

            default:
                return "text-gray-500 bg-gray-50 border border-gray-500/10";
        }
    }

    const getPriorityTagColor = () => {
        switch (priority) {
            case "Low":
                return "text-red-500 bg-red-50 border border-red-500/10";

            case "Medium":
                return "text-yellow-500 bg-yellow-50 border border-yellow-500/10";

            default:
                return "text-gray-500 bg-gray-50 border border-gray-500/10";
        }
    }
    return <div
        className='bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer'
        onClick={onClick}
    >
        <div className='flex items-end gap-3 px-4'>
            <div className={`text-[11px] font-medium ${getStatusTagColor()} px-2 py-0.5 rounded-full`}>
                {status}
            </div>

            <div className={`text-[11px] font-medium ${getPriorityTagColor()} px-2 py-0.5 rounded-full`}>
                {priority} Priority
            </div>

        </div>

        <div
            className={`px-4 border-l-[3px] ${status === "In Progress"
                ? "border-cyan-500"
                : status === "Completed"
                    ? "border-lime-500"
                    : "border-gray-500/10"
                }`}>
            <p className='text-sm font-medium text-gray-500 mt-1.5 line-clamp-2'>
                {title}
            </p>

            <p className='text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]'>
                {description}
            </p>

            <p className='text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]'>
                Task Done:{" "}
                <span className='font-semibold text-gray-700'>
                    {completedTodoCount}/{todoChecklist.length || 0}
                </span>
            </p>
            <Progresss progress={progress} status={status} />
        </div>

        <div className='px-4'>
            <div className='flex items-center justify-between my-1'>
                <div className=''>
                    <label className='text-xs text-gray-500'> Start Date </label>
                    <p className='text-[13px] font-medium text-gray-900'>
                        {moment(createdAt).format("DD-MM-YYYY")}
                    </p>
                </div>

                <div>
                    <label className='text-xs text-gray-500'> Due Date </label>
                    <p className='text-[13px] font-medium text-gray-900'>
                        {moment(dueDate).format("DD-MM-YYYY")}
                    </p>
                </div>
            </div>

            <div className='flex items-center justify-between mt-3'>
                <AvatarGroup avatars={assignedTo} />
                <p className='text-xs text-gray-500 font-medium'>{user[0].name}</p>

                {attachmentCount > 0 && (
                    <div className='flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg'>
                        <LuPaperclip className='text-blue-500' />{" "}
                        <span className='text-xs text-gray-900'>{attachmentCount}</span>
                    </div>
                )}
            </div>
        </div>
    </div>

}

export default TaskCard