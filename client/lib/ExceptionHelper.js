import ApplicationException from './ApplicationException';

export default class ExceptionHelper {
    static handle(action, message, context) {
        try {
            action();
        } catch (ex) {
            throw new ApplicationException(message, ex, context);
        } finally {}
    }
}
