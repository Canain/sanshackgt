/// <reference path="../../typings/tsd.d.ts" />

/// <reference path="passportwindowslive.d.ts" />
/// <reference path="passporthttpbearer.d.ts" />

declare module 'rand-token' {
	export function suid(size: number, epoch?: number, prefixLength?: number);
}