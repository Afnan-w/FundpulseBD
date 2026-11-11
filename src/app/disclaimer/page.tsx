export const metadata = {
  title: "Disclaimer | FundpulseBD",
  description: "Full legal disclaimer for FundpulseBD — information only, not investment advice.",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Disclaimer
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <p>
          FundpulseBD is an educational news portal focused on savings and
          investment news for Bangladesh. The content on this website is provided
          for general informational purposes only.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          1. Not Investment Advice
        </h2>
        <p>
          Nothing on this website constitutes investment advice, a recommendation
          to buy or sell any security, or an endorsement of any fund, product,
          or service. Always consult a qualified financial advisor before making
          any investment decisions.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          2. No Affiliation
        </h2>
        <p>
          FundpulseBD is not affiliated with, endorsed by, or connected to the
          Bangladesh Securities and Exchange Commission (BSEC), Bangladesh Bank,
          the National Savings Directorate (NSD), or any government regulator.
          We are an independent educational news portal.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          3. Source Attribution
        </h2>
        <p>
          All articles include a link to the original source. We do not reproduce
          full article text — only summaries with attribution. Readers should
          visit the original source for complete information.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          4. Accuracy
        </h2>
        <p>
          We strive to provide accurate summaries, but we do not guarantee the
          completeness, reliability, or accuracy of any information. Users should
          verify information with the original source before relying on it.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          5. External Links
        </h2>
        <p>
          This website contains links to external websites. We are not responsible
          for the content or practices of any third-party website.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          6. No Buy/Sell Recommendations
        </h2>
        <p>
          FundpulseBD does not provide buy, sell, or hold recommendations for any
          security, fund, or investment product. All content is educational.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mt-8">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong>Contact:</strong> For questions about this disclaimer, please
          visit our <a href="/contact" className="text-emerald-600 dark:text-emerald-400 hover:underline">Contact page</a>.
        </p>
      </div>
    </div>
  );
}