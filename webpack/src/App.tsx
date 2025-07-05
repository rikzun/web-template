import "./App.style.scss"
import WebpackLogo from "@assets/webpack-logo.svg"
import videoURL from "@assets/hello there.mp4?url"

export function App() {
    return (
        <div className="container">
            <WebpackLogo className="logo" />

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
