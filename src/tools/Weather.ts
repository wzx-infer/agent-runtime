/**
 * Weather 天气查询工具
 * 提供天气信息查询功能（模拟实现）
 */

import { Tool } from '../core/Tool';

export class Weather extends Tool {
  constructor() {
    super({
      name: 'weather',
      description: '查询指定城市的天气信息',
      parameters: [
        {
          name: 'city',
          type: 'string',
          description: '城市名称，例如: "北京"、"上海"',
          required: true,
        },
        {
          name: 'unit',
          type: 'string',
          description: '温度单位: "celsius" 或 "fahrenheit"',
          required: false,
        },
      ],
    });
  }

  async execute(params: Record<string, any>): Promise<any> {
    const { city, unit = 'celsius' } = params;

    if (!city || typeof city !== 'string') {
      throw new Error('城市名称不能为空');
    }

    // 模拟天气数据
    // 实际应用中，这里应该调用真实的天气 API
    const weatherData = this.getMockWeatherData(city, unit);

    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    return weatherData;
  }

  /**
   * 获取模拟天气数据
   */
  private getMockWeatherData(city: string, unit: string): any {
    // 模拟的天气条件
    const conditions = ['晴朗', '多云', '阴天', '小雨', '大雨'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

    // 生成随机温度
    const baseTemp = unit === 'celsius' ? 20 : 68;
    const tempRange = unit === 'celsius' ? 15 : 30;
    const temperature = Math.floor(baseTemp + (Math.random() - 0.5) * tempRange);

    return {
      city,
      condition: randomCondition,
      temperature,
      unit: unit === 'celsius' ? '°C' : '°F',
      humidity: Math.floor(50 + Math.random() * 30),
      windSpeed: Math.floor(5 + Math.random() * 20),
      timestamp: new Date().toISOString(),
      note: '⚠️ 这是模拟数据，非真实天气信息',
    };
  }
}
