
let APP_ID = "798cd77efec044a2bd8be48499bf14de"
let token = null ; 
let uid = Math.floor((Math.random() * 10000))
let client ; 
let channel ; 

let localStream ; 
let remoteStream ; 
let peerConnection ; 

const servers = {
    iceServers : [
        {
            urls : ['stun:stun1.l.google.com:19302','stun:stun2.l.google.com:19302']
        }
        
    ]
}

let init = async () => {
    client = await AgoraRTM.createInstance(APP_ID)
    await client.login({uid, token})

    channel = client.createChannel('main')
    await channel.join()

    channel.on('MemberJoin', handleUserJoined)


    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    document.getElementById('user-1').srcObject = localStream 
    createOffer()
}
 
let handleUserJoined = async (MemberId) => {
    console.log("member joined : " , MemberId)
}

let createOffer = async () => {
    peerConnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream ()
    document.getElementById('user-2').srcObject = remoteStream 

        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream)
        })

        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack()
            })

        }

        peerConnection.onicecandidate = async (event) => {
            if(event.candidate) {
                console.log ("new icecandidate " , event.candidate)
            }
        }



    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    console.log("offer : ", offer)

}

init() 