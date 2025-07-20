import RootEquationRenderer from "./renderers/RootEquationRenderer";
import IntegralRenderer from "./renderers/IntegralRenderer";

const renderClassMap = {
    EquationRenderer: RootEquationRenderer,
    IntegralRenderer: IntegralRenderer
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