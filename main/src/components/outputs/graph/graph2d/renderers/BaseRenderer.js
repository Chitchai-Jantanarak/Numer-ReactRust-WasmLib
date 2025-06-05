export default class BaseRenderer {
    supports(topic, method) {
        throw new Error("BaseRenderer is an abstract class form");
    }

    render(datas) {
        throw new Error("BaseRenderer is an abstract class form");
    }

}