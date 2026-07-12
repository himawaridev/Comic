import { Gift, HeartHandshake, Mail } from "lucide-react";

export default function HoTroNhanhPage() {
  return (
    <div className="screen-shell">
      <section className="app-container support-page soft-card">
        <span className="pill is-active">Support</span>
        <h1>Ho tro nhanh</h1>
        <p>Gui loi nhan, dong gop y tuong hoac bao loi de trai nghiem doc truyen ngay cang muot hon.</p>
        <div className="support-grid">
          <div>
            <HeartHandshake size={24} />
            <strong>Gop y giao dien</strong>
            <span>Chia se dieu ban muon cai thien.</span>
          </div>
          <div>
            <Mail size={24} />
            <strong>Lien he</strong>
            <span>admin@example.com</span>
          </div>
          <div>
            <Gift size={24} />
            <strong>Donate</strong>
            <span>Ung ho du an phat trien lau dai.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
