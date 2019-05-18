import { has } from '@/utils/authority';

export default ({resource, component}) => {
    if (has(resource)) {
        return component;
    }
    return null;
}
