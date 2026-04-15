<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <xsl:output method="html" encoding="UTF-8" indent="yes" media-type="text/html"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title>XML Sitemap</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            color: #e5e5e5;
            min-height: 100vh;
            padding: 40px 20px;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 50px;
          }
          .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(to right, #00f2fe, #00c4cc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
          }
          .header p {
            color: #9ca3af;
            font-size: 1.1rem;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
          }
          .stat-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
          }
          .stat-card .number {
            font-size: 2rem;
            font-weight: 700;
            color: #00f2fe;
            display: block;
          }
          .stat-card .label {
            color: #9ca3af;
            font-size: 0.9rem;
            margin-top: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          thead {
            background: rgba(0, 242, 254, 0.1);
          }
          th {
            padding: 16px;
            text-align: left;
            font-weight: 600;
            color: #00f2fe;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          td {
            padding: 14px 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 0.9rem;
          }
          tr:hover {
            background: rgba(0, 242, 254, 0.05);
          }
          .url {
            color: #00f2fe;
            font-weight: 500;
            word-break: break-all;
          }
          .priority {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
          }
          .priority-high {
            background: rgba(0, 242, 254, 0.2);
            color: #00f2fe;
          }
          .priority-medium {
            background: rgba(255, 193, 7, 0.2);
            color: #ffc107;
          }
          .priority-low {
            background: rgba(156, 163, 175, 0.2);
            color: #9ca3af;
          }
          .frequency {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.8rem;
            background: rgba(255, 255, 255, 0.05);
            color: #e5e5e5;
          }
          .date {
            color: #9ca3af;
            font-size: 0.85rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>️ XML Sitemap</h1>
            <p>Generated on <xsl:value-of select="format-dateTime(current-dateTime(), '[Y0001]-[M01]-[D01] [H01]:[m01]')"/></p>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <span class="number"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
              <span class="label">Total URLs</span>
            </div>
            <div class="stat-card">
              <span class="number">4</span>
              <span class="label">Languages</span>
            </div>
            <div class="stat-card">
              <span class="number">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:priority &gt;= 0.8])"/>
              </span>
              <span class="label">High Priority</span>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a class="url" href="{sitemap:loc}" target="_blank">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <span class="date">
                      <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                    </span>
                  </td>
                  <td>
                    <span class="frequency">
                      <xsl:value-of select="sitemap:changefreq"/>
                    </span>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:priority &gt;= 0.8">
                        <span class="priority priority-high">
                          <xsl:value-of select="sitemap:priority"/>
                        </span>
                      </xsl:when>
                      <xsl:when test="sitemap:priority &gt;= 0.5">
                        <span class="priority priority-medium">
                          <xsl:value-of select="sitemap:priority"/>
                        </span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="priority priority-low">
                          <xsl:value-of select="sitemap:priority"/>
                        </span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
