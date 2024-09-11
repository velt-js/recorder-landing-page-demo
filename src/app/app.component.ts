import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { initVelt } from '@veltdev/client';
import { User, Velt } from '@veltdev/types';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-root',
	standalone: true,
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [NgIf]
})

export class AppComponent implements OnInit {
	title = 'recorder';
	client: Velt | undefined;
	RECORDER_ID = '';
	backgroundColor: string = '#192A7C';
	recordingType: string = 'all';

	constructor(private route: ActivatedRoute) { }

	async ngOnInit() {
		this.route.queryParams.subscribe(params => {
			this.backgroundColor = params['backgroundColor'] || '#192A7C';
			this.recordingType = params['type'] || 'all';
		});

		// Initialize Velt
		this.client = await initVelt('AN5s6iaYIuLLXul0X4zf');

		if (this.client) {
			// Create the Velt user object
			const user: User = {
				userId: 'sad',
				name: 'Gene',
				email: 'gene@velt.dev',
				color: '#EBA900',
				textColor: "FFF",
			};

			this.client?.identify(user);

			this.client.setDocument('landing-page-demo-recorder-audio', { documentName: 'landing-page-demo-recorder-audio' });

			const recorderControlPanel = document.querySelector('velt-recorder-control-panel');
			
			recorderControlPanel?.addEventListener('onRecordedData', (s: any) => {
				console.log('onRecordedData', s?.detail);
				this.RECORDER_ID = s.detail.id;
			});

		}
	}

}
