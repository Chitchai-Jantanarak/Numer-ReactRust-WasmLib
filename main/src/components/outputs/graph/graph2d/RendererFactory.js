import RootEquationRenderer from "./renderers/RootEquationRenderer";

const renderClassMap = {
    EquationRenderer: RootEquationRenderer
}

class RendererFactory {
    create(renderKey) {        
        const RendererClass = renderClassMap[renderKey];
        if (!RendererClass) {
            console.warn(`Renderer key "${renderKey}" not found`);
            return null;
        }

        return RendererClass;
    }
}

export default new RendererFactory();