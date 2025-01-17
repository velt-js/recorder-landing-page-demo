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
	darkMode: boolean = false;  // Add this line

	constructor(private route: ActivatedRoute) { }

	async ngOnInit() {
		this.route.queryParams.subscribe(params => {
			this.backgroundColor = params['backgroundColor'] || '#192A7C';
			this.recordingType = params['type'] || 'all';
			this.darkMode = params['darkMode'] === 'true';

			document.body.style.backgroundColor = this.backgroundColor;
		});

		this.RECORDER_ID = localStorage.getItem('recorderId') || '';

		// Initialize Velt
		this.client = await initVelt('AN5s6iaYIuLLXul0X4zf');

		if (this.client) {
			// Create the Velt user object
			const user: User = {
				organizationId: 'recorder_lp_demo',
				userId: 'gene',
				name: 'Gene',
				email: 'gene@velt.dev',
				color: '#EBA900',
				textColor: "FFF",
			};

			this.client?.identify(user);

			this.client.setDocument('landing-page-demo-recorder-audio', { documentName: 'landing-page-demo-recorder-audio' });

			console.log(this.darkMode);
			if (this.darkMode) {
				this.client?.setDarkMode(true);
				document.body.style.colorScheme = this.darkMode ? 'dark' : 'light';
			}


			const recorderControlPanel = document.querySelector('velt-recorder-control-panel');

			recorderControlPanel?.addEventListener('onRecordedData', (s: any) => {
				console.log('onRecordedData', s?.detail);
				this.RECORDER_ID = s.detail.id;
				console.log(this.RECORDER_ID);

				localStorage.setItem('recorderId', this.RECORDER_ID);

			});

			const recorderPlayer = document.querySelector('velt-recorder-player');

			recorderPlayer?.addEventListener('onDelete', (s: any) => {
				console.log('DELETE', s?.detail);
				this.RECORDER_ID = '';
				localStorage.removeItem('recorderId');
			});

		}
	}

}
