'use client'
import { useEffect } from "react";
import { useSocket } from "@/components/ui/SocketProvider";
import { useRouter } from "next/navigation";

export default function Queue() {

    const { socket } = useSocket();
    const router = useRouter()

    useEffect(() => {

        socket?.emit("join_queue", socket.id)

        socket?.on('matched', (data) => {
            router.push('/chat/' + data.room)
        })

        return () => {
            socket?.off('matched')
        }

    }, [])

    return <div className="justify-center items-center text-2xl bg-brand-cream text-brand-dark">
        Please Wai, Waiting for a partner to join...
    </div>
}