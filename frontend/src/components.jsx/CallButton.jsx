import { VideoIcon } from "lucide-react"


const CallButton = ({ handleVideoCall }) => {
  return (
     <div className="absolute left-4 top-4 z-20">
      <button
        type="button"
        onClick={handleVideoCall}
        className="btn btn-success btn-sm text-white shadow-lg"
        aria-label="Start video call"
      >
        <VideoIcon className="h-5 w-5" />
      </button>
    </div>
  )
}

export default CallButton