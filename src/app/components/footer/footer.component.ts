import { Component } from "@angular/core";
import {
  FaIconLibrary,
  FontAwesomeModule,
} from "@fortawesome/angular-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [FontAwesomeModule], // only standalone components/modules here
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(faFacebookF, faTwitter, faInstagram); // register icons here
  }
}
