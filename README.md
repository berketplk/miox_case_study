# AI Destekli Hasar Süreci Takibi

Bu proje, verilen case study kapsamında sigorta hasar sürecini kullanıcıya şeffaf, etkileşimli ve aksiyon odaklı şekilde sunan bir dashboard uygulamasıdır.

Amaç; kullanıcının şu üç soruya hızlıca cevap alabilmesini sağlamaktır:

* Mevcut durumum nedir?
* Süreç ne kadar daha sürecek?
* Şu anda yapmam gereken bir aksiyon var mı?

## Çalıştırma

```bash
npm install
npm run dev
```

---

## Mimari ve Tasarım Kararları

### Mobile-First Yaklaşım

Uygulama mobile-first olarak tasarlanmıştır.

* Mobilde: Accordion tabanlı step yapısı
* Desktop’ta: Timeline + detay panel split layout

Bu sayede her cihazda okunabilirlik ve kullanılabilirlik korunur.

---

### Polymorphic Data Yönetimi (Registry Pattern)

`processDetails` dizisindeki her adım farklı veri yapısına sahiptir.

Bu karmaşıklığı yönetmek için:

* `stepRegistry` kullanılmıştır
* Her step tipi kendi component’i ile render edilir
* `if / else` blokları yerine dinamik component mapping tercih edilmiştir

Bu yaklaşım:

* Ölçeklenebilirliği artırır
* Yeni step tiplerinin kolay eklenmesini sağlar

---

### State Yönetimi Ayrımı

* **React Query:** Server state (API data fetching, React Query varsayılan cache davranışı)
* **Zustand:** Client state

  * Step içi node’lar (note / attachment)
  * AI sonuçları (explanation, analyzer result)
* **Local component state (`useState`):**

  * AI butonları için loading durumları
  * Accordion / expandable UI durumları

Bu ayrım ile state yönetimi sade ve sürdürülebilir tutulmuştur.

---

### Veri Doğrulama

API’den gelen veri, UI’a ulaşmadan önce Zod ile doğrulanır.
Bu sayede:

* Runtime hataları minimize edilir
* UI güvenli hale getirilir

---

### Dynamic Node Management

Kullanıcılar step’ler arasına değil, **step’lerin içine bağlı node’lar ekleyebilir:**

* 📝 Information Note
* 📎 Additional Attachment

Node’lar:

* Zustand store’da tutulur
* İlgili step altında render edilir
* Eklenip silinebilir

Bu yaklaşım, process step’leri ile user-generated content’i ayrıştırır.

---

### AI Feature Yaklaşımı (Simülasyon)

Case gereği AI özellikleri simüle edilmiştir:

#### Explain with AI

* Her step için bağlamsal açıklama üretir
* Loading state içerir
* Step içinde gösterilir

#### Document Analyzer

* Dosya yükleme sonrası validasyon yapılır
* Örnek: Occupational Certificate kontrolü
* Teknik sonuç: `Accepted`, `Needs Review`, `Rejected`
* UI gösterimi: `Rejected` => **Invalid**, diğer sonuçlar => **Valid**

---

## Özellikler

* Mevcut durum, dosya numarası ve kalan süreyi hızlı gösterim
* Action-required step’ler için:

  * Timeline vurgusu
  * Global uyarı alanı
* İlerleme takibi:

  * Progress bar
  * Tamamlanan step sayısı (x / y)
* Responsive tasarım (mobile, tablet, desktop)
* Step bazlı etkileşimler:

  * Explain with AI
  * Note ekleme
  * Attachment ekleme
* Dinamik node yönetimi (ekleme / silme)

---

## UX Kararları

* Action-required durumlar kırmızı/uyarı renkleri ile öne çıkarılmıştır
* Aktif step görsel olarak highlight edilir
* Mobilde dokunma alanları geniş tutulmuştur
* Timeline ve detay alanı bilgi hiyerarşisine göre ayrılmıştır

---


## Kullanılan AI Araçları

* Cursor: Component yapısı, state yönetimi ve kod üretimi için aktif olarak kullanıldı.
* ChatGPT: Mimari kararların netleştirilmesi (özellikle registry pattern, state ayrımı ve dynamic node yapısı), UX iyileştirmeleri ve case gereksinimlerinin doğru yorumlanması süreçlerinde destek alındı.

---

#
