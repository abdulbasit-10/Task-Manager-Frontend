import React from 'react'
import { LuUserPlus, LuActivity, LuUsers } from 'react-icons/lu'

const FEATURES = [
    {
        icon: LuUserPlus,
        title: 'Assign',
        description: 'Delegate tasks to your team in seconds.',
    },
    {
        icon: LuActivity,
        title: 'Track',
        description: 'See real-time progress across every task.',
    },
    {
        icon: LuUsers,
        title: 'Align',
        description: 'Keep everyone updated, automatically.',
    },
];

const AuthLayout = ({ children }) => {
    return (
        <div className='flex h-screen w-full overflow-hidden font-body'>
            <div className='w-full md:w-[58%] h-full px-8 sm:px-12 pt-8 pb-12 bg-white overflow-y-auto'>
                <div className='flex items-center gap-2'>
                    <span className='w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center'>
                        <span className='w-2.5 h-2.5 rounded-[3px] bg-white' />
                    </span>
                    <h2 className='text-lg font-display font-semibold text-ink-900'>Task Manager</h2>
                </div>
                {children}
            </div>

            <div className='hidden md:flex md:w-[42%] h-full items-center justify-center relative overflow-hidden bg-brand-500'>
                {/* subtle dot grid backdrop */}
                <div
                    className='absolute inset-0 opacity-[0.15]'
                    style={{
                        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />
                <div className='absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-600/40 blur-3xl' />
                <div className='absolute -bottom-28 -left-16 w-72 h-72 rounded-full bg-brand-700/40 blur-3xl' />

                <div className='relative z-10 w-full max-w-sm px-8'>
                    <p className='font-mono text-[11px] uppercase tracking-widest text-white/70'>
                        Built for teams
                    </p>
                    <h3 className='font-display text-2xl font-semibold text-white mt-1.5 mb-8 leading-snug'>
                        One place for your team&apos;s work
                    </h3>

                    <div className='flex flex-col gap-5'>
                        {FEATURES.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className='flex items-start gap-3.5'
                                    style={{
                                        animation: 'rise-in 0.5s ease-out both',
                                        animationDelay: `${idx * 0.12 + 0.1}s`,
                                    }}
                                >
                                    <span className='w-9 h-9 shrink-0 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center'>
                                        <Icon size={16} className='text-white' />
                                    </span>
                                    <div className='min-w-0'>
                                        <p className='text-[13.5px] font-semibold text-white'>
                                            {feature.title}
                                        </p>
                                        <p className='text-[13px] text-white/70 mt-0.5 leading-snug'>
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout

