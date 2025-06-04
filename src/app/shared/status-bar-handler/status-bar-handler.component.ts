import { Component, OnInit, Renderer2 } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-status-bar-handler',
  templateUrl: './status-bar-handler.component.html',
  styleUrls: ['./status-bar-handler.component.scss'],
})
export class StatusBarHandlerComponent  implements OnInit {

 constructor(
    private renderer: Renderer2,
    private platform: Platform
  ) {}

  async ngOnInit(): Promise<void> {
    await this.platform.ready();

    // Limité à iOS uniquement
    if (this.platform.is('ios')) {
      // ✅ Appliquer safe-area via Renderer
      this.renderer.setStyle(document.body, 'padding-top', 'env(safe-area-inset-top)');
      this.renderer.setStyle(document.body, 'padding-left', 'env(safe-area-inset-left)');
      this.renderer.setStyle(document.body, 'padding-right', 'env(safe-area-inset-right)');
      this.renderer.setStyle(document.body, 'padding-bottom', 'env(safe-area-inset-bottom)');

      // ✅ Éviter que le contenu passe sous la barre de statut
      await StatusBar.setOverlaysWebView({ overlay: false });

      // ✅ Style et fond de la barre de statut
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
    }
  }

}
