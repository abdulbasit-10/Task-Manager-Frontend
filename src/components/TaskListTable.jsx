import moment from 'moment';
import React from 'react'

const TaskListTable = ({ tableData }) => {
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "Completed": return 'bg-green-100 text-green-800 border border-green-200';
            case "Pending": return 'bg-purple-100 text-purple-800 border border-purple-200';
            case "In Progress": return 'bg-cyan-100 text-cyan-800 border border-cyan-200';
            default: return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    }

    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case "High": return 'bg-red-100 text-red-800 border border-red-200';
            case "Medium": return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case "Low": return 'bg-green-100 text-green-800 border border-green-200';
            default: return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    }
    return (
        <div className='overflow-x-auto p-0 rounded-lg mt-3'>
            <table className='min-w-full'>
                <thead>
                    <tr className='text-left'>
                        <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Name</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Status</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Priority</th>
                        <th className='py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell'>Created On</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        tableData.map((task) => {
                            <tr key={task._id} className='border-t border-gray-200'>
                                <td className='my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden'>{task.title}</td>
                                <td className='py-4 px-4'>
                                    <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(task.status)}`}>{task.status}</span>
                                </td>

                                <td className="">
                                    <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(task.priority)}`}>{task.priority}</span>
                                </td>

                                <td className='py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell'>{task.createdAt ? moment(task.createdAt).format("DD-MM-YYYY") : "-"}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TaskListTable
