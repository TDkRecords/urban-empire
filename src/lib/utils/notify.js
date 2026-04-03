import { browser } from '$app/environment';

function notify(action, ...args) {
    if (!browser || !window.alertify) return;
    window.alertify[action](...args);
}

export function success(message) {
    notify('success', message);
}

export function error(message) {
    notify('error', message);
}

export function info(message) {
    notify('message', message);
}

export function alert(message, title = 'Atención') {
    notify('alert', title, message);
}

export function confirm(message, onOk, onCancel) {
    if (!browser || !window.alertify) {
        console.warn("Alertify not available");
        return;
    }
    window.alertify.confirm('Confirmación', message, onOk || (() => { }), onCancel || (() => { }));
}
