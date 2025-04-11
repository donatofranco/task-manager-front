export default function Loading() {
    return (
        <main className='h-[90dvh] w-[100dvw] flex justify-center items-center'>
            <div className="relative text-center flex self-center justify-center items-center">
                <h1>
                    <strong className="absolute translate-x-[-50%] translate-y-[-50%]
                     text-cyan-400 text-2xl blur-[8px]">Loading...</strong>
                    <strong className="absolute translate-x-[-50%] translate-y-[-50%]
                     text-cyan-400 text-2xl">Loading...</strong>
                </h1>
            </div>
        </main>
    )
}