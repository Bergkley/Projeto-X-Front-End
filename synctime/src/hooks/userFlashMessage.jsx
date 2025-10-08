import bus from "../utils/bus";

export default function useFlashMessage() {

    function setFlashMessage(msg, type) {
        console.log('msg',msg)
        bus.emit('flash', {
            message: msg, 
            type: type})
    }

    return {setFlashMessage}
}