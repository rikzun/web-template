import "./App.style.scss"
import RspackLogo from "@assets/rspack-logo.svg"
import videoURL from "@assets/hello there.mp4?url"

export function App() {
    return (
        <div className="container">
            <RspackLogo className="logo" />

            <video
                autoPlay
                muted
                controls
                src={videoURL}
                onLoadStart={(e) => e.currentTarget.volume = .4}
            />
        </div>
    )
}
