import KeyGetter from "./KeyGetter.js";
import RendererFactory from "./RendererFactory";

const Graph2DMaker = ({ datas, context }) => {
    const { topic, method, renderKey } = KeyGetter.getRenderer(context);

    if (!renderKey) {
        console.error(`No renderer found for topic: ${topic}, method: ${method}`);
        return null;
    }
    
    const RendererComponent = RendererFactory.create(renderKey);

    if (!RendererComponent) {
        return (
            <div className="rounded bg-error"> Renderer not available </div>
        )
    }

    return <RendererComponent datas={datas} />;
}

export default Graph2DMaker;