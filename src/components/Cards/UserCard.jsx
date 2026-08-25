import React from 'react'

const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
};

const UserCard = ({ userInfo, onToggleStatus }) => {
    const isActive = userInfo?.isActive !== false;

    return (
        <div className={`user-card p-2 ${!isActive ? 'opacity-60' : ''}`}>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    {userInfo?.profileImageUrl ? (
                        <img
                            src={userInfo.profileImageUrl}
                            alt={userInfo?.name || 'Avatar'}
                            className='w-12 h-12 rounded-full border-2 border-white object-cover'
                        />
                    ) : (
                        <div className='w-12 h-12 rounded-full bg-brand-50 border-2 border-white flex items-center justify-center shrink-0'>
                            <span className='text-[13px] font-semibold text-brand-600'>
                                {getInitials(userInfo?.name)}
                            </span>
                        </div>
                    )}

                    <div className=''>
                        <p className='text-sm font-medium'>{userInfo?.name}</p>
                        <p className='text-xs text-gray-500'>
                            {userInfo?.email}
                        </p>
                    </div>
                </div>

                {!isActive && (
                    <span className='text-[10px] font-medium text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full shrink-0'>
                        Deactivated
                    </span>
                )}
            </div>

            <div className='flex items-end gap-3 mt-5'>
                <StatCard
                    label='Pending'
                    count={userInfo?.pendingTasks || 0}
                    status='Pending'
                />

                <StatCard
                    label='In progress'
                    count={userInfo?.inprogressTasks || 0}
                    status='In progress'
                />

                <StatCard
                    label='Completed'
                    count={userInfo?.completedTasks || 0}
                    status='Completed'
                />
            </div>

            <button
                type='button'
                onClick={() => onToggleStatus?.(userInfo._id)}
                className={`w-full mt-3 text-[12px] font-medium py-1.5 rounded-lg border cursor-pointer transition-colors ${isActive
                        ? 'text-red-600 bg-red-50 border-red-100 hover:bg-red-100'
                        : 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100'
                    }`}
            >
                {isActive ? 'Deactivate' : 'Activate'}
            </button>
        </div>
    )
}

export default UserCard


const StatCard = ({ label, count, status }) => {

    const getStatusTagColor = () => {
        switch (status) {
            case "In progress":
                return "text-cyan-500 bg-gray-50";

            case "Completed":
                return "text-indigo-500 bg-gray-50";

            default:
                return "text-violet-500 bg-gray-50";
        }
    }
    return (
        <div
            className={`flex-1 text-[10px] font-medium
                ${getStatusTagColor()} px-4 py-0.5 rounded
                `}>
            <span className='text-[12px] font-semibold'>
                {count}
            </span>
            <br />
            {label}
        </div>
    )
}
