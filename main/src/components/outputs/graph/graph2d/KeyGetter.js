import { ioSchemas } from "../../../../config/ioSchemas";

const rendererMapper = {
    root_equation: {
        root_equation: "abc",
        default: "EquationRenderer"
    },
    interpolation: {}
}

class KeyGetter {
    constructor(rendererMapper) {
        this.rendererMapper = rendererMapper;
    }

    getRenderer(context) {  
        for (const topic in ioSchemas) {
            const methods = ioSchemas[topic];
            if (methods && typeof methods === "object") {
                for (const methodKey in methods) {
                    if (context == methodKey) {
                        const mapVal = this.rendererMapper[topic];
                        let rendererKey = null;

                        if (typeof mapVal === "string") rendererKey = mapVal;
                        else if (typeof mapVal === "object") rendererKey = mapVal[methodKey] || mapVal.default || null;

                        return {
                            topic,
                            method: methodKey,
                            renderKey: rendererKey
                        };
                    }
                }
            }
        }

        return {
            topic: null,
            method: null,
            rendererKey: null
        }
    }
}

export default new KeyGetter(rendererMapper);