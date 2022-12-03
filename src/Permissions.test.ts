import { isGranted, missing } from './Permissions';

test('test isGranted set of permissions', function () {
    expect(isGranted(['localStorage'], {
        localStorage: false,
        camera: false,
        geolocation: false,
    })).toEqual(false);
    expect(isGranted(['localStorage'], {
        localStorage: true,
        camera: false,
        geolocation: false,
    })).toEqual(true);
    expect(isGranted(['localStorage', 'geolocation'], {
        localStorage: true,
        camera: false,
        geolocation: true,
    })).toEqual(true);
    expect(isGranted(['localStorage', 'camera', 'geolocation'], {
        localStorage: true,
        camera: true,
        geolocation: true,
    })).toEqual(true);
});

test('test missing set of permissions', function () {
    expect(missing(['localStorage'], {
        localStorage: false,
        camera: false,
        geolocation: false,
    })).toEqual(['localStorage']);
    expect(missing(['localStorage'], {
        localStorage: true,
        camera: false,
        geolocation: false,
    })).toEqual([]);
});