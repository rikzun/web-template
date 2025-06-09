import './App.style.scss'

export function App() {
    const params = Object.entries({
        cc_load_policy: 0,
        controls: 2,
        fs: 0,
        rel: 0,
        showinfo: 0
    }).map(([key, value]) => `${key}=${value}`).join('&')

    return <iframe src={'https://youtube.com/embed/BNflNL40T_M?' + params} />
}
