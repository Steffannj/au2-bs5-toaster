import { PublishToastChannel, RemoveToastChannel } from './toasterChannels';
import { containerless, DI, IDisposable, IEventAggregator } from "aurelia";
import { IToast } from './IToast';

export const IToaster = DI.createInterface<Toaster>('IToaster');

@containerless
export class Toaster {
	showToastSubscription: IDisposable;
	removeToastSubscription: IDisposable;
	toasts: Array<IToast>;

	constructor(
		@IEventAggregator private EventAggregator: IEventAggregator
	) {
		this.toasts = [];
	}

	attached() {
		this.showToastSubscription = this.EventAggregator.subscribe(PublishToastChannel, (tst: IToast) => {
			this.toasts.push(tst);
		});
		this.removeToastSubscription = this.EventAggregator.subscribe(RemoveToastChannel, (tst: IToast) => {
			let idx = this.toasts.indexOf(tst);
			this.toasts.splice(idx, 1);
		})
	}

	dispose() {
		this.showToastSubscription.dispose();
		this.removeToastSubscription.dispose();
	}
}