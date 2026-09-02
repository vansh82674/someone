'use client'
import { Button } from "@/components/ui/button"
import { useSocket } from "@/components/ui/SocketProvider"
import { useParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"


type Message = {
    text: string,
    senderId: string,
    room: string
}

export default function ChatRoom() {

    // get the socket connecteds
    const { socket } = useSocket();
    const params = useParams();
    const router = useRouter()

    // get the room id from params
    const roomId = String(params.roomId);

    // message array for displaying messages on UI
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");

    // for auto scrolling to the bottom purpose
    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        // for listening the new message
        socket?.on('new_message', (msg: Message) => {
            setMessages((prev) => [...prev, msg])
        })

        // for stranger disconnects
        socket?.on('stranger_disconnected', (data) => {
            setMessages((prev) => [...prev, { text: "Stranger has disconnected.", senderId: "system", room: roomId }]);
        })

        return () => {
            socket?.off('new_message');
            socket?.off('stranger_disconnected');
        }


    }, [])

    // send message function
    const sendMessage = () => {
        const newMsg = {
            text: inputValue,
            senderId: socket?.id || "unknown",
            room: roomId
        }
        // show it on user screen
        setMessages((prev) => [...prev, newMsg])
        socket?.emit("send_message", { ...newMsg, room: roomId })
        setInputValue("")
    }

    // intentionally want to leave chat 
    const leaveChat = () => {
        socket?.emit("leave_room", { room: roomId })
        setMessages([])
        router.push('/')
    }

    return <div className="justify-center items-center bg-brand-cream text2-2xl text-brand-dark">
        <Button onClick={leaveChat}>Leave Chat</Button>
        {
            messages.map((msg, i) => (
                <div key={i} className="text-xl text-brand-dark">{msg.text}</div>
            ))
        }
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <Button className='text-xl' onClick={sendMessage} >Send Message</Button>
    </div>
}