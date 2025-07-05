import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export async function GET(request: NextRequest) {
  try {
    const notionToken = process.env.NOTION_TOKEN;
    
    if (!notionToken || notionToken === 'your-notion-integration-token-here') {
      return NextResponse.json(
        { error: 'Notion integration token not configured. Please add NOTION_TOKEN to your .env.local file.' },
        { status: 401 }
      );
    }

    const notion = new Client({
      auth: notionToken,
      logLevel: process.env.NODE_ENV === 'development' ? 'DEBUG' : 'WARN',
    });

    // Search for pages in the workspace
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page',
      },
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time',
      },
      page_size: 50,
    });

    // Extract relevant information from pages
    const pages = response.results.map((page: any) => {
      if (page.object === 'page') {
        return {
          id: page.id,
          title: page.properties?.title?.title?.[0]?.plain_text || 
                 page.properties?.Name?.title?.[0]?.plain_text || 
                 'Untitled',
          url: page.url,
          last_edited: page.last_edited_time,
          created: page.created_time,
        };
      }
      return null;
    }).filter(Boolean);

    return NextResponse.json({ pages });
  } catch (error: any) {
    console.error('Error fetching Notion pages:', error);
    
    // Handle specific Notion API errors
    if (error.code === 'unauthorized') {
      return NextResponse.json(
        { error: 'Invalid Notion token. Please check your NOTION_TOKEN in .env.local' },
        { status: 401 }
      );
    }
    
    if (error.code === 'forbidden') {
      return NextResponse.json(
        { error: 'No pages found. Make sure to share pages with your Notion integration.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch Notion pages. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const notionToken = process.env.NOTION_TOKEN;
    
    if (!notionToken || notionToken === 'your-notion-integration-token-here') {
      return NextResponse.json(
        { error: 'Notion integration token not configured.' },
        { status: 401 }
      );
    }

    const { pageId } = await request.json();
    
    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    const notion = new Client({
      auth: notionToken,
      logLevel: process.env.NODE_ENV === 'development' ? 'DEBUG' : 'WARN',
    });

    // Get page content
    const page = await notion.pages.retrieve({ page_id: pageId });
    
    // Get page blocks (content)
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    // Extract text content from blocks
    const extractTextFromBlocks = (blocks: any[]): string => {
      return blocks.map(block => {
        switch (block.type) {
          case 'paragraph':
            return block.paragraph?.rich_text?.map((text: any) => text.plain_text).join('') || '';
          case 'heading_1':
            return block.heading_1?.rich_text?.map((text: any) => text.plain_text).join('') || '';
          case 'heading_2':
            return block.heading_2?.rich_text?.map((text: any) => text.plain_text).join('') || '';
          case 'heading_3':
            return block.heading_3?.rich_text?.map((text: any) => text.plain_text).join('') || '';
          case 'bulleted_list_item':
            return '• ' + (block.bulleted_list_item?.rich_text?.map((text: any) => text.plain_text).join('') || '');
          case 'numbered_list_item':
            return '1. ' + (block.numbered_list_item?.rich_text?.map((text: any) => text.plain_text).join('') || '');
          case 'to_do':
            const checked = block.to_do?.checked ? '☑' : '☐';
            return checked + ' ' + (block.to_do?.rich_text?.map((text: any) => text.plain_text).join('') || '');
          case 'quote':
            return '> ' + (block.quote?.rich_text?.map((text: any) => text.plain_text).join('') || '');
          case 'code':
            return '```\n' + (block.code?.rich_text?.map((text: any) => text.plain_text).join('') || '') + '\n```';
          default:
            return '';
        }
      }).filter(text => text.trim() !== '').join('\n\n');
    };

    const content = extractTextFromBlocks(blocks.results);
    
    return NextResponse.json({
      page: {
        id: pageId,
        title: (page as any).properties?.title?.title?.[0]?.plain_text || 
               (page as any).properties?.Name?.title?.[0]?.plain_text || 
               'Untitled',
        content,
        url: (page as any).url,
        last_edited: (page as any).last_edited_time,
      }
    });
  } catch (error: any) {
    console.error('Error fetching Notion page content:', error);
    
    if (error.code === 'unauthorized') {
      return NextResponse.json(
        { error: 'Invalid Notion token.' },
        { status: 401 }
      );
    }
    
    if (error.code === 'object_not_found') {
      return NextResponse.json(
        { error: 'Page not found or not shared with integration.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch page content.' },
      { status: 500 }
    );
  }
}
