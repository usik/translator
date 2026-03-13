import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Xenith privacy policy. Learn how we handle your data, files, and privacy. Your files are processed in memory and deleted immediately.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: March 12, 2026
      </p>

      {/* English Section */}
      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-semibold">English</h2>

        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <h3 className="text-lg font-medium text-foreground">Overview</h3>
          <p>
            Xenith is a free online translation and file conversion tool. We are
            committed to protecting your privacy. This policy explains what data
            we collect and how we handle it.
          </p>

          <h3 className="text-lg font-medium text-foreground">
            No Account Required
          </h3>
          <p>
            Xenith does not require you to create an account or log in. We do
            not collect personal information such as your name, email address, or
            phone number.
          </p>

          <h3 className="text-lg font-medium text-foreground">
            File Processing
          </h3>
          <p>
            Files you upload for translation or conversion are processed in
            memory on our servers. They are{" "}
            <strong>deleted immediately after processing is complete</strong>. We
            do not store, archive, or retain your files in any way.
          </p>

          <h3 className="text-lg font-medium text-foreground">
            Cookies &amp; Analytics
          </h3>
          <p>
            We use Google Analytics to understand how visitors use Xenith. Google
            Analytics may set cookies in your browser to collect anonymous usage
            data such as page views, session duration, and general geographic
            region. No personally identifiable information is collected through
            analytics.
          </p>

          <h3 className="text-lg font-medium text-foreground">
            Third-Party Services
          </h3>
          <p>
            We do not sell, share, or provide your data to any third parties
            beyond what is described above (Google Analytics). File content is
            sent to AI translation APIs for processing and is not retained by
            those services after the request completes.
          </p>

          <h3 className="text-lg font-medium text-foreground">Advertising</h3>
          <p>
            Xenith may display advertisements through Google AdSense. Google
            AdSense may use cookies to serve ads based on your browsing history.
            You can manage your ad personalization settings through{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Google Ads Settings
            </a>
            .
          </p>

          <h3 className="text-lg font-medium text-foreground">Contact</h3>
          <p>
            If you have any questions about this privacy policy, please reach out
            via{" "}
            <a
              href="https://github.com/yusikkim/xenith/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              GitHub Issues
            </a>
            .
          </p>
        </div>
      </section>

      {/* Korean Section */}
      <section className="mt-16 space-y-6">
        <h2 className="text-xl font-semibold">한국어 (Korean)</h2>

        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <h3 className="text-lg font-medium text-foreground">개요</h3>
          <p>
            Xenith는 무료 온라인 번역 및 파일 변환 도구입니다. 사용자의
            개인정보 보호를 중요하게 생각하며, 이 정책은 수집하는 데이터와
            그 처리 방법에 대해 설명합니다.
          </p>

          <h3 className="text-lg font-medium text-foreground">
            계정 불필요
          </h3>
          <p>
            Xenith는 계정 생성이나 로그인이 필요하지 않습니다. 이름, 이메일
            주소, 전화번호 등 개인정보를 수집하지 않습니다.
          </p>

          <h3 className="text-lg font-medium text-foreground">
            파일 처리
          </h3>
          <p>
            번역 또는 변환을 위해 업로드한 파일은 서버 메모리에서 처리되며,{" "}
            <strong>처리가 완료된 즉시 삭제됩니다</strong>. 파일을 저장,
            보관하거나 어떠한 방식으로도 유지하지 않습니다.
          </p>

          <h3 className="text-lg font-medium text-foreground">
            쿠키 및 분석
          </h3>
          <p>
            Xenith는 방문자의 이용 패턴을 이해하기 위해 Google Analytics를
            사용합니다. Google Analytics는 페이지 조회수, 세션 시간, 일반적인
            지역 정보 등 익명의 사용 데이터를 수집하기 위해 쿠키를 설정할 수
            있습니다. 분석을 통해 개인 식별 정보는 수집되지 않습니다.
          </p>

          <h3 className="text-lg font-medium text-foreground">
            제3자 서비스
          </h3>
          <p>
            위에 설명된 Google Analytics 외에 데이터를 제3자에게 판매, 공유
            또는 제공하지 않습니다. 파일 내용은 AI 번역 API로 전송되어
            처리되며, 해당 서비스에서 요청 완료 후 보관되지 않습니다.
          </p>

          <h3 className="text-lg font-medium text-foreground">광고</h3>
          <p>
            Xenith는 Google AdSense를 통해 광고를 표시할 수 있습니다. Google
            AdSense는 사용자의 브라우징 기록에 따라 광고를 제공하기 위해
            쿠키를 사용할 수 있습니다.{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Google 광고 설정
            </a>
            에서 광고 맞춤설정을 관리할 수 있습니다.
          </p>

          <h3 className="text-lg font-medium text-foreground">문의</h3>
          <p>
            이 개인정보 보호정책에 대한 질문이 있으시면{" "}
            <a
              href="https://github.com/yusikkim/xenith/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              GitHub Issues
            </a>
            를 통해 연락해 주세요.
          </p>
        </div>
      </section>
    </div>
  );
}
