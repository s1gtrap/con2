import { join } from './utils';

test('test joining single or collection of strings', function () {
    expect(join('localStorage')).toBe('localStorage');
    expect(join(['camera'])).toBe('camera');
    expect(join(['localStorage', 'camera'])).toBe('camera and localStorage');
    expect(join(['geolocation', 'camera', 'localStorage'])).toBe('camera, geolocation and localStorage');
    expect(join(['localStorage', 'geolocation', 'camera'])).toBe('camera, geolocation and localStorage');
});