export const boxEditorUiTemplate = `
<div id="sub-views">
			<div class="box-info non-selectable" id="box-info"></div>
			<div class="view-manipulator" id="z-view-manipulator" tabindex="-1">
				<div class="sub-views-size">
					<div id="sub-views-size-top-val"></div>
					<div id="sub-views-size-top-tag">俯视图</div>
				</div>
				<svg class="subview-svg" id="view-svg">
					<circle cx="50%" cy="50%" r="5" class="origin-point-indicator" id="origin-point-indicator"></circle>
					<rect x="70" y="50" width="20" height="140" fill="#00000000" class="line-handle ew-handle"
						id="line-left-handle" />
					<line x1="80" y1="40" x2="80" y2="200" class="svg-line" id="line-left" />

					<rect x="90" y="30" width="40" height="20" fill="#00000000" class="line-handle ns-handle"
						id="line-top-handle" />
					<line x1="80" y1="40" x2="140" y2="40" class="svg-line" id="line-top" />

					<rect x="130" y="50" width="20" height="140" fill="#00000000" class="line-handle ew-handle"
						id="line-right-handle" />
					<line x1="140" y1="40" x2="140" y2="200" class="svg-line" id="line-right" />

					<rect x="90" y="190" width="40" height="20" fill="#00000000" class="line-handle ns-handle"
						id="line-bottom-handle" />
					<line x1="80" y1="200" x2="140" y2="200" class="svg-line" id="line-bottom" />

					<rect x="110" y="120" width="20" height="70" fill="#00000000" class="line-handle  ew-handle"
						id="line-direction-handle" />
					<line x1="110" y1="120" x2="110" y2="40" class="svg-line" id="line-direction" />

					<rect x="60" y="40" width="20" height="20" fill="#00000000" class="line-handle  nw-handle"
						id="top-left-handle" />
					<rect x="110" y="120" width="20" height="20" fill="#00000000" class="line-handle  ne-handle"
						id="top-right-handle" />
					<rect x="110" y="120" width="20" height="20" fill="#00000000" class="line-handle  sw-handle"
						id="bottom-left-handle" />
					<rect x="110" y="120" width="20" height="20" fill="#00000000" class="line-handle  se-handle"
						id="bottom-right-handle" />

					<rect x="100" y="110" width="20" height="20" fill="#00000000" class="line-handle grab-handle"
						id="move-handle" />
				</svg>
				<div class="v-buttons-wrapper" id="v-buttons">
					<div id="v-fit-position" class="ui-button" title="Fit position">
						<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"
							class="svg-button">
							<g>
								<rect x="8" y="8" width="12" height="12" stroke-dasharray="1" />
								<rect x="4" y="4" width="12" height="12" />
							</g>
						</svg>
					</div>
					<div id="v-fit-rotation" class="ui-button" title="Fit Rotation">
						<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"
							class="svg-button">
							<g>
								<rect x="8" y="10" width="12" height="10" />
								<polyline points="3 5 15 3 17 13 5 15 3 5" stroke-dasharray="1" />
							</g>
						</svg>
					</div>

					<div id="v-fit-size" class="ui-button" title="Fit size">
						<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"
							class="svg-button">
							<g>
								<rect x="8" y="10" width="10" height="12" stroke-dasharray="1" />
								<rect x="4" y="4" width="8" height="10" />
							</g>
						</svg>
					</div>


					<div id="v-fit-all" class="ui-button" title="Fit all">
						<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"
							class="svg-button">
							<g>
								<rect x="6" y="6" width="14" height="14" />
								<polyline points="3 5 15 3 17 13 5 15 3 5" stroke-dasharray="1" />
							</g>
						</svg>
					</div>

					<div id="v-fit-moving-direction" class="ui-button" title="Fit moving direction">
						<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"
							class="svg-button">
							<g>
								<polyline points="6 18 14 10" />
								<polyline points="10 10 14 10 14 14" />
								<circle cx=5 cy=19 r=2 />
								<circle cx=19 cy=5 r=2 />
							</g>
						</svg>
					</div>

				</div>
			</div>
			<div class="view-manipulator" id="y-view-manipulator" tabindex="-1">
				<div class="sub-views-size">
					<div id="sub-views-size-left-val"></div>
					<div id="sub-views-size-left-tag">左视图</div>
				</div>
				<svg class="subview-svg" id="view-svg">
					<rect x="70" y="50" width="20" height="140" fill="#00000000" class="line-handle ew-handle"
						id="line-left-handle" />
					<line x1="80" y1="40" x2="80" y2="200" class="svg-line" id="line-left" />

					<rect x="90" y="30" width="40" height="20" fill="#00000000" class="line-handle ns-handle"
						id="line-top-handle" />
					<line x1="80" y1="40" x2="140" y2="40" class="svg-line" id="line-top" />

					<rect x="130" y="50" width="20" height="140" fill="#00000000" class="line-handle ew-handle"
						id="line-right-handle" />
					<line x1="140" y1="40" x2="140" y2="200" class="svg-line" id="line-right" />

					<rect x="90" y="190" width="40" height="20" fill="#00000000" class="line-handle ns-handle"
						id="line-bottom-handle" />
					<line x1="80" y1="200" x2="140" y2="200" class="svg-line" id="line-bottom" />

					<rect x="110" y="120" width="20" height="70" fill="#00000000" class="line-handle  ew-handle"
						id="line-direction-handle" />
					<line x1="110" y1="120" x2="110" y2="40" class="svg-line" id="line-direction" />

					<rect x="60" y="40" width="20" height="20" fill="#00000000" class="line-handle  nw-handle"
						id="top-left-handle" />
					<rect x="110" y="120" width="20" height="20" fill="#00000000" class="line-handle  ne-handle"
						id="top-right-handle" />
					<rect x="110" y="120" width="20" height="20" fill="#00000000" class="line-handle  sw-handle"
						id="bottom-left-handle" />
					<rect x="110" y="120" width="20" height="20" fill="#00000000" class="line-handle  se-handle"
						id="bottom-right-handle" />

					<rect x="100" y="110" width="20" height="20" , fill="#00000000" class="line-handle  grab-handle"
						id="move-handle" />

				</svg>
				<div class="v-buttons-wrapper" id="v-buttons">
					<div id="v-fit-all" class="ui-button" title="fit all">
						<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"
							class="svg-button">
							<g>
								<rect x="6" y="6" width="14" height="14" />
								<polyline points="3 5 15 3 17 13 5 15 3 5" stroke-dasharray="1" />
							</g>
						</svg>
					</div>
					<div id="v-reset-rotation" class="ui-button" title="reset rotation">
						<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"
							class="svg-button">
							<g>
								<circle cx=12 cy=12 r=8 />
								<circle cx=12 cy=12 r=1 />
							</g>
						</svg>
					</div>
				</div>
			</div>
			<div class="view-manipulator" id="x-view-manipulator" tabindex="-1">
				<div class="sub-views-size">
					<div id="sub-views-size-front-val"></div>
					<div id="sub-views-size-front-tag">后视图</div>
				</div>
				<svg class="subview-svg" id="view-svg">
					<rect x="70" y="50" width="20" height="140" fill="#00000000" class="line-handle ew-handle"
						id="line-left-handle" />
					<line x1="80" y1="40" x2="80" y2="200" class="svg-line" id="line-left" />

					<rect x="90" y="30" width="40" height="20" fill="#00000000" class="line-handle ns-handle"
						id="line-top-handle" />
					<line x1="80" y1="40" x2="140" y2="40" class="svg-line" id="line-top" />

					<rect x="130" y="50" width="20" height="140" fill="#00000000" class="line-handle ew-handle"
						id="line-right-handle" />
					<line x1="140" y1="40" x2="140" y2="200" class="svg-line" id="line-right" />

					<rect x="90" y="190" width="40" height="20" fill="#00000000" class="line-handle ns-handle"
						id="line-bottom-handle" />
					<line x1="80" y1="200" x2="140" y2="200" class="svg-line" id="line-bottom" />

					<rect x="110" y="120" width="20" height="70" fill="#00000000" class="line-handle  ew-handle"
						id="line-direction-handle" />
					<line x1="110" y1="120" x2="110" y2="40" class="svg-line" id="line-direction" />

					<rect x="60" y="40" width="20" height="20" fill="#00000000" class="line-handle  nw-handle"
						id="top-left-handle" />
					<rect x="110" y="120" width="20" height="20" fill="#00000000" class="line-handle  ne-handle"
						id="top-right-handle" />
					<rect x="110" y="120" width="20" height="20" fill="#00000000" class="line-handle  sw-handle"
						id="bottom-left-handle" />
					<rect x="110" y="120" width="20" height="20" fill="#00000000" class="line-handle  se-handle"
						id="bottom-right-handle" />

					<rect x="100" y="110" width="20" height="20" fill="#00000000" class="line-handle  grab-handle"
						id="move-handle" />

				</svg>
				<div class="v-buttons-wrapper" id="v-buttons">
					<div id="v-fit-all" class="ui-button" title="fit all">
						<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"
							class="svg-button">
							<g>
								<rect x="6" y="6" width="14" height="14" />
								<polyline points="3 5 15 3 17 13 5 15 3 5" stroke-dasharray="1" />
							</g>
						</svg>
					</div>
					<div id="v-reset-rotation" class="ui-button" title="reset rotation">
						<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"
							class="svg-button">
							<g>
								<circle cx=12 cy=12 r=8 />
								<circle cx=12 cy=12 r=1 />
							</g>
						</svg>
					</div>
				</div>
			</div>
			<canvas id="focuscanvas" class="non-selectable" width="320" height="240">cavas</canvas>
		</div>
`