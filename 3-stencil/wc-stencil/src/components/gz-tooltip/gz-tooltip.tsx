import { Component, h, Prop, State } from "@stencil/core";

@Component({
    tag: 'gz-tooltip',
    styleUrl: './gz-tooltip.css',
    shadow: true
})
export class Tooltip {
    @Prop()
    tooltipText: string;

    @State()
    opened = false;

    onToggleTooltip() {
        this.opened = !this.opened;
    }

    render() {
        return [
            <slot />,
            <span
                class="tooltip-container"
                onClick={() => this.onToggleTooltip()}
            >
                (?)
                {this.opened && <div class="tooltip-text">{this.tooltipText}</div>}
            </span>,
        ]
    }
}
