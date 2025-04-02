import { Divider } from 'antd'
import { Card, CardContent } from '../ui/card'
import { TokenIcon } from '@web3icons/react'

interface ReportCardProps {
  category: string
  description: string
  reporter: string
  reportedAddresses: string[]
  reportedDomain: string[]
}

export const ReportCard = ({
  category,
  description,
  reporter,
  reportedAddresses,
  reportedDomain,
}: ReportCardProps) => {
  return (
    <Card className="p-4 shadow-xl rounded-lg max-w-7xl bg-white border border-gray-200 pt-6">
      <CardContent>
        <div className="flex flex-col space-y-4">
          
          {/* Category & Description (Horizontally aligned) */}
          <div className="flex items-start space-x-6">
            <div className="text-2xl-semibold font-sans font-bold text-gray-900 w-[180px]">
              {category}
            </div>
            <div className="flex-1">
              <p className="text-gray-500 whitespace-pre-wrap leading-relaxed line-clamp-6">
                {description}
              </p>
              <p className="text-gray-600 mt-4">
                Submitted by <span className="font-medium">{reporter}</span>
              </p>
            </div>
          </div>

          <Divider />

          {/* Reported Addresses */}
          {reportedAddresses.length > 0 && (
            <div className="space-y-4">
              {reportedAddresses.slice(0, 3).map((add, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className="text-lg font-semibold text-gray-400 w-[180px]">
                    Reported Addresses
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 flex-1">
                    <TokenIcon symbol="eth" variant="branded" />
                    <span className="text-gray-700 font-mono">{add}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Divider />

          {/* Reported Domains */}
          {reportedDomain.length > 0 && (
            <div className="space-y-4">
              {reportedDomain.map((dom, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className="text-lg font-semibold text-gray-400 w-[180px]">
                    Reported Domains
                  </div>
                  <div className="p-3 rounded-lg border border-gray-200 flex-1">
                    <a
                      href={dom}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      {dom}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
