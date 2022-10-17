import automate from '../automations';

export const name = 'ready';
export const once = true;

export const execute = async () => {
    console.log('🤖 Ready!');
    automate();
};
