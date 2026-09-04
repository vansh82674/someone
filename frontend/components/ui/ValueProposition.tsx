
export default function ValueProposition() {
    return <section className="w-full bg-brand-dark py-20 px-6">
        <div className="flex flex-col items-center justify-center p-10">
            <h2 className="md:text-5xl text-3xl text-white font-bold">Everyone is connected.</h2>
            <h2 className="md:text-5xl text-3xl text-[#A684FF] font-bold">Not everyone feels heard.</h2>
        </div>
        <div className="bg-[#1A1717] rounded-3xl max-w-2xl mx-auto text-white/70 p-6 md:p-12 text-lg font-sans flex flex-col gap-y-6">
            <div className="border-l-[#403C38] border-l-2 pl-4">
                <p>Your friends know your history.</p>
                <p>Your family knows your expectations.</p>
                <p>The people around you already have an opinion.</p>
            </div>


            <strong className="block text-white border-l-brand-violet  border-l-2 pl-4">Sometimes you need a completely different perspective.</strong>

            <div className="border-l-[#403C38] pl-4 border-l-2">
                <p>Someone who doesn't know your past.</p>
                <p>Someone who doesn't judge your story.</p>
                <p>Someone who simply listens.</p>
            </div>
        </div>
    </section >
}